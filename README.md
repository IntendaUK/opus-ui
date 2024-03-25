# Getting Started

[Read our getting started guide here](https://opus-ui.com/docs?articleId=1-1-introduction)

# Why use Opus UI

Opus empowers developers in many ways. To truly understand how it does this, we need to understand which facets of development it aims to simplify:

---

## Accelerate development
Opus UI rapidly speeds up development through one simple concept: Your components can affect anything part of another component. Experienced developers will prefer that interfaces be written between components and modules, and while Opus UI allows this type of development as well, rapid prototyping is where Opus shines. Once an application is complete, developers can decide which parts of it to replace with pure React components.

To illustrate this point, let's look at a simple Todo list built in pure React. In this example, primarily note the following:

When a child component wants to do something, the developer must write extra code in the parent component to:
1. Create structures in which to store state and through which to modify state
2. Build handlers that utilize the aforementioned structures
3. Pass the handlers into the child component(s)

Without Opus UI, developers must implement multiple structures and handlers when building new features. They must then pass these handlers to child components before the child components can implement the features.

```jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

//The parent component sends us the handler we need to use
const TodoItem = ({ value, onDelete }) => {
    return (
        <li>
            {value}
            <button onClick={onDelete}>Delete</button>
        </li>
    );
};

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');

    //When we want to use a value later, we need to write code to keep track of it while it changes
    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    //Because we know child components will affect us, we have to create the functions first and pass them through
    const handleAddTodo = () => {
        if (inputValue.trim() !== '') {
            setTodos([...todos, inputValue]);
            setInputValue('');
        }
    };

    //Creating another handler
    const handleDeleteTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    return (
        <div className='todo-app'>
            <h1>To-Do List</h1>
            <div className='todo-input'>
                <input
                    type='text'
                    value={inputValue}
                    //Pass in the relevant handler
                    onChange={handleInputChange}
                    placeholder='Enter your task'
                />
                //Pass in the relevant handler
                <button onClick={handleAddTodo}>Add</button>
            </div>
            <ul className='todo-list'>
                {todos.map((value, index) => (
                    <TodoItem
                        key={index}
                        value={value}
                        //Pass in the relevant handler
                        onDelete={() => handleDeleteTodo(index)}
                    />
                ))}
            </ul>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));

root.render(<Todo />);
```

Now let's look at the same as built using Opus UI:

```jsx
import { createRoot } from 'react-dom/client';
import Opus, { registerExternalAction } from '@intenda/opus-ui';

import '@intenda/opus-ui-components';

const root = createRoot(document.getElementById('root'));

const generateEntry = ({ value }) => {
    return {
        scope: 'entry',
        type: 'containerSimple',
        prps: { dir: 'horizontal' },
        wgts: [{
            type: 'label',
            prps: { cpt: value }
        },
        {
            type: 'button',
            prps: {
                cpt: 'Delete',
                fireScript: {
                    actions: [{
                        type: 'resolveScopedId',
                        scopedId: 'entry',
                        storeAsVariable: 'idToRecolor'
                    },
                    {
                        /*
                            This action tells the parent component that we want to remove ourselves.
                            We didn't need to do any setup for this first.
                        */
                        type: 'setState',
                        target: '||todo||',
                        key: 'deleteKeys',
                        value: [{
                            key: 'extraWgts',
                            value: { id: '||entry||' }
                        }]
                    }]
                }
            }
        }]
    };
};

registerExternalAction({
    type: 'generateEntry',
    handler: generateEntry
});

root.render(
    <Opus startupMda={{
        scope: 'todo',
        type: 'container',
        wgts: [{
            type: 'containerSimple',
            prps: { dir: 'horizontal' },
            wgts: [{
                //We don't need to create structures to store the input's value
                relId: 'input',
                type: 'input',
                prps: {
                    placeholder: 'Enter your task'
                }
            }, {
                type: 'button',
                prps: {
                    cpt: 'Add',
                    fireScript: {
                        actions: [{
                            type: 'generateEntry',
                            //We simply grab the input's value using Opus' UI's very powerful scopes system
                            value: '((state.||todo.input||.value))',
                            storeAsVariable: 'newEntry'
                        },
                        {
                            //No other setup needed. We just add the new component to our extraWgts array
                            type: 'setState',
                            target: '||todo||',
                            key: 'extraWgts',
                            value: '{{variable.newEntry}}'
                        }]
                    }
                }
            }]
        }]
    }} />
);
```

Understanding the distinction highlighted by the previous two examples really encapsulates the benefits Opus UI brings to the table: When you want to build a feature, you only need build it. This is as opposed to having to implement structures in all relevant parent components to support your feature. We certainly do not claim that this is the best way of doing it, but when it comes to prototyping applications, developers should not be nailed down by constraints. Opus UI allows you to get into that developer flow state that much more often.

## Components are data
When all components (or many components, in cases where you also render plain React components) within your application are stored as data, it paves the way for tools to be built to simplify things like prototyping, maintaining, debugging, and optimizing applications. This is an area in which we are investing a lot of effort.

## Dynamic with no limits
Because Opus UI can convert data into components, it excels at dynamic behavior. An Opus component can generate more components and more functionality with ease. Developers can also write their own tools to convert their own data structures into Opus components and applications.