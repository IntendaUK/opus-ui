/* eslint-disable max-lines, max-lines-per-function */

// Helper: BFS up/down
const closestAnywhere = (startEl, selector) => {
	if (startEl.matches(selector))
		return startEl;

	const visited = new Set([startEl]);
	const queue = [startEl];
	while (queue.length) {
		const node = queue.shift();
		const parent = node.parentElement;
		if (parent && !visited.has(parent)) {
			visited.add(parent);
			if (parent.matches(selector))
				return parent;

			queue.push(parent);
		}
		for (const child of node.children) {
			if (!visited.has(child)) {
				visited.add(child);
				if (child.matches(selector))
					return child;

				queue.push(child);
			}
		}
	}

	return null;
};

// Helper: BFS text-only, returns element and text
const closestTextNode = startEl => {
	const visited = new Set([startEl]);
	const queue = [startEl];
	while (queue.length) {
		const node = queue.shift();
		if (node.childElementCount === 0) {
			const txt = node.textContent.trim();
			if (txt) {
				return {
					el: node,
					text: txt
				};
			}
		}
		const parent = node.parentElement;
		if (parent && !visited.has(parent)) {
			visited.add(parent);
			queue.push(parent);
		}
		for (const child of node.children) {
			if (!visited.has(child)) {
				visited.add(child);
				queue.push(child);
			}
		}
	}

	return null;
};

// Helper: distance between two nodes via BFS
const distanceBetween = (startEl, targetEl) => {
	const visited = new Set([startEl]);
	const queue = [{
		el: startEl,
		dist: 0
	}];
	while (queue.length) {
		const { el: node, dist } = queue.shift();
		if (node === targetEl)
			return dist;

		const parent = node.parentElement;
		if (parent && !visited.has(parent)) {
			visited.add(parent);
			queue.push({
				el: parent,
				dist: dist + 1
			});
		}
		for (const child of node.children) {
			if (!visited.has(child)) {
				visited.add(child);
				queue.push({
					el: child,
					dist: dist + 1
				});
			}
		}
	}

	return -1;
};

// Unique-selector builder (same as before)
const buildUniqueSelector = el => {
	const tid = el.getAttribute('data-testid');
	if (!tid)
		return null;

	const base = '[data-testid="' + tid + '"]';
	if (document.querySelectorAll(base).length === 1)
		return base;

	const ancestors = [];
	let p = el.parentElement;
	while (p) {
		const ptid = p.getAttribute('data-testid');
		if (ptid)
			ancestors.push('[data-testid="' + ptid + '"]');
		p = p.parentElement;
	}
	let chain = null;
	for (let i = 0; i < ancestors.length; i++) {
		const segs = ancestors.slice(0, i + 1).reverse().concat([base]);
		const sel = segs.join(' > ');
		if (document.querySelectorAll(sel).length === 1) {
			chain = segs;

			break;
		}
	}
	if (!chain)
		return null;

	let improved = true;
	while (improved) {
		improved = false;

		for (let k = 0; k < chain.length - 1; k++) {
			const test = chain.slice(0, k).concat(chain.slice(k + 1));
			if (document.querySelectorAll(test.join(' > ')).length === 1) {
				chain = test;
				improved = true;

				break;
			}
		}
	}

	return chain.join(' > ');
};

const buildGridCellLocator = ({ elementId }) => {
	try {
		// 1. Get the element
		const el = document.getElementById(elementId);
		if (!el)
			throw new Error(`No element found with ID "${elementId}"`);

		// 2. Recurse up to find "X-cell-Y-Z"
		const cellIdRe = /^(.+)-cell-(.+)-(\d+)$/;
		let cursor = el;
		let cellMatch = null;

		while (cursor) {
			if (cursor.id)
				cellMatch = cursor.id.match(cellIdRe);

			if (cellMatch)
				break;

			cursor = cursor.parentElement;
		}

		if (!cellMatch)
			throw new Error('No ancestor with id matching "X-cell-Y-Z"');

		const [ , X, Y, Zstr ] = cellMatch;
		const Z = parseInt(Zstr, 10);

		// 3. Find text node inside "X-headerCell-Y"
		const headerCellId = `${X}-headerCell-${Y}`;
		const headerCell = document.getElementById(headerCellId);

		if (!headerCell)
			throw new Error(`No element with id "${headerCellId}"`);

		const findText = node => {
			for (const child of node.childNodes) {
				if (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
					return child.textContent.trim();

				const found = findText(child);

				if (found)
					return found;
			}

			return null;
		};

		const cellText = findText(headerCell);

		if (!cellText)
			throw new Error(`No text node found in headerCell "${headerCellId}"`);

		// 4. Collect all "X-headerCell-A" filter fields
		const filterFields = [];
		const headerRegex = new RegExp(`^${X}-headerCell-(.+)$`);
		const headerEls = document.querySelectorAll(`[id^="${X}-headerCell-"]`);

		headerEls.forEach(hEl => {
			const m = hEl.id.match(headerRegex);

			if (m) {
				const label = findText(hEl) || m[1];
				filterFields.push({
					key: m[1],
					label
				});
			}
		});

		if (filterFields.length === 0)
			throw new Error(`No header filter fields found for prefix "${X}-headerCell-"`);

		// 6. Find all "X-columnInner-B"
		const columnRegex = new RegExp(`^${X}-columnInner-(.+)$`);
		const allColumnEls = Array.from(document.querySelectorAll(`[id^="${X}-columnInner-"]`));
		const columnInners = allColumnEls.filter(cEl => columnRegex.test(cEl.id));

		if (columnInners.length === 0)
			throw new Error(`No columnInner elements found for prefix "${X}-columnInner-"`);

		// 7–9. For each, get their Zth child’s text or input value
		const filterValues = columnInners.map(cEl => {
			const children = Array.from(cEl.children);
			const target = children[Z] || null;
			let value = '';

			if (target) {
				const text = findText(target);

				if (text)
					value = text;

				const input = target.querySelector('input');

				if (input && input.value.trim())
					value = input.value.trim();
			}

			return value;
		});

		// 10. Build "filterField=filterValue" pairs
		const filters = filterFields
			.map((f, i) => `${f.label}=${filterValues[i] || ''}`)
			.filter((v, i) => {
				const field = filterFields[i].label.toLowerCase();
				const value = filterValues[i];

				const ignoreField = (
					field.includes('date') ||
					field === 'select all' ||
					field === 'active indicator' ||
					value === ''
				);

				return !ignoreField;
			})
			.join(',');

		// 11. Find grid container with data-testid including "@l2_grid" but not "@l2_grid/"
		const findGrid = node => {
			if (!node)
				return null;

			const dt = node.getAttribute('data-testid');

			if (dt && dt.includes('@l2_grid') && !dt.includes('@l2_grid/'))
				return node;

			return findGrid(node.parentElement);
		};

		const gridEl = findGrid(el);

		if (!gridEl)
			throw new Error('No ancestor with data-testid including "@l2_grid"');

		// 12. Return final locator
		const testid = gridEl.getAttribute('data-testid');

		return `[data-testid="${testid}"]:cell(${cellText}):filters(${filters})`;
	} catch (err) {
		console.error('buildGridCellLocator error:', err.message);

		return null;
	}
};

// eslint-disable-next-line complexity
const buildTestIdLocator = config => {
	const { elementId, findType, isFiltered, isGridCell } = config;

	const originalEl = document.getElementById(elementId);
	if (!originalEl)
		return null;

	if (isGridCell)
		return buildGridCellLocator(config);

	// FILTERED MODE
	if (isFiltered) {
		// 1. find text node + text
		const txtNode = closestTextNode(originalEl);
		if (!txtNode)
			return null;

		const filterString = txtNode.text;
		// 2. find container relative to text node
		let container;
		if (findType === 'Click')
			container = closestAnywhere(txtNode.el, '.cpnContainer, .cpnButton');
		else if (findType === 'Input')
			container = closestAnywhere(txtNode.el, '.cpnInput input');
		else
			container = txtNode.el;

		if (!container)
			return null;

		// determine selector type
		let typeSel = '';
		if (container.matches('.cpnContainer'))
			typeSel = '.cpnContainer';
		else if (container.matches('.cpnButton'))
			typeSel = '.cpnButton';
		else if (container.matches('input'))
			typeSel = '.cpnInput input';
		else if (container.matches('[data-testid]'))
			typeSel = '[data-testid="' + container.getAttribute('data-testid') + '"]';
		else
			return null;

		// 3. climb parents while still unique among siblings of same type
		let current = container;
		while (current.parentElement) {
			current = current.parentElement;
			const count = current.querySelectorAll(typeSel).length;
			if (count > 1)
				break;
		}
		// 4. build unique selector for the final parent
		const sel = buildUniqueSelector(current);
		if (!sel)
			return null;

		// 5. compute distance from container to text node
		const dist = distanceBetween(container, txtNode.el);

		return sel + ' ' + typeSel + ':filter(' + filterString + '):distance(' + dist + ')';
	}

	// NON-FILTERED MODE (unchanged)
	let elementFromStep1;
	if (findType === 'Basic') {
		elementFromStep1 = originalEl;

		const tid = originalEl.getAttribute('data-testid');
		if (!tid)
			return null;
	} else if (findType === 'Input') {
		elementFromStep1 = closestAnywhere(originalEl, '.cpnInput input');
		if (!elementFromStep1)
			return null;

		const inputTid = elementFromStep1.getAttribute('data-testid');
		if (!inputTid) {
			const p1 = elementFromStep1.parentElement;
			const p2 = p1 && p1.parentElement;
			if (!p2)
				return null;

			const grandTid = p2.getAttribute('data-testid');
			if (!grandTid)
				return null;
		}
	} else if (findType === 'Click') {
		elementFromStep1 = closestAnywhere(originalEl, '.cpnContainer, .cpnButton');

		if (!elementFromStep1)
			return null;

		const tid = elementFromStep1.getAttribute('data-testid');
		if (!tid)
			return null;
	} else
		return null;

	const res = buildUniqueSelector(elementFromStep1);

	return res;
};

export default buildTestIdLocator;
