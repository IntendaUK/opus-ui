if (
	/Firefox\/\d+[\d\.]*/.test(navigator.userAgent) &&
	typeof window.DragEvent === 'function' &&
	typeof window.addEventListener === 'function'
) {
	(function () {
		// Patch for Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=505521
		let cx, cy, px, py, ox, oy, sx, sy, lx, ly;
		const update = function (e) {
			cx = e.clientX; cy = e.clientY;
			px = e.pageX; py = e.pageY;
			ox = e.offsetX; oy = e.offsetY;
			sx = e.screenX; sy = e.screenY;
			lx = e.layerX; ly = e.layerY;
		};
		const assign = function (e) {
			/* eslint-disable-next-line no-underscore-dangle */
			e._ffix_cx = cx; e._ffix_cy = cy;
			/* eslint-disable-next-line no-underscore-dangle */
			e._ffix_px = px; e._ffix_py = py;
			/* eslint-disable-next-line no-underscore-dangle */
			e._ffix_ox = ox; e._ffix_oy = oy;
			/* eslint-disable-next-line no-underscore-dangle */
			e._ffix_sx = sx; e._ffix_sy = sy;
			/* eslint-disable-next-line no-underscore-dangle */
			e._ffix_lx = lx; e._ffix_ly = ly;
		};
		window.addEventListener('mousemove', update, true);
		window.addEventListener('dragover', update, true);
		// bug #505521 identifies these three listeners as problematic:
		// (although tests show 'dragstart' seems to work now, keep to be compatible)
		window.addEventListener('dragstart', assign, true);
		window.addEventListener('drag', assign, true);
		window.addEventListener('dragend', assign, true);

		let me = Object.getOwnPropertyDescriptors(window.MouseEvent.prototype);

		const getter = function (prop, repl) {
			return function () {
				return me[prop] && me[prop].get.call(this) || Number(this[repl]) || 0;
			};
		};

		let ue = Object.getOwnPropertyDescriptors(window.UIEvent.prototype);

		const layerGetter = function (prop, repl) {
			return function () {
				return (
					(this.type === 'dragover' && ue[prop]) ?
						ue[prop].get.call(this) :
						(Number(this[repl]) || 0)
				);
			};
		};
		const properties = {
			clientX: { get: getter('clientX', '_ffix_cx') },
			clientY: { get: getter('clientY', '_ffix_cy') },
			pageX: { get: getter('pageX', '_ffix_px') },
			pageY: { get: getter('pageY', '_ffix_py') },
			offsetX: { get: getter('offsetX', '_ffix_ox') },
			offsetY: { get: getter('offsetY', '_ffix_oy') },
			screenX: { get: getter('screenX', '_ffix_sx') },
			screenY: { get: getter('screenY', '_ffix_sy') },
			x: { get: getter('x', '_ffix_cx') },
			y: { get: getter('y', '_ffix_cy') },
			layerX: { get: layerGetter('layerX', '_ffix_lx') },
			layerY: { get: layerGetter('layerY', '_ffix_ly') }
		};

		Object.entries(properties).forEach(([k, v]) => {
			if (window.DragEvent.prototype.hasOwnProperty(k))
				return;

			Object.defineProperty(window.DragEvent.prototype, k, v);
		});
	})();
}
