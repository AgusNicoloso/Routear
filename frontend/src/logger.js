// https://github.com/flitbit/diff#differences
import differ from 'deep-diff';

const dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:',
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:',
  },
  D: {
    color: '#F44336',
    text: 'DELETED:',
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:',
  },
};

function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
  case 'E':
    return `${path.join('.')} ${lhs} → `;
  case 'N':
    return `${path.join('.')} `;
  case 'D':
    return `${path.join('.')}`;
  case 'A':
    return `${path.join('.')}[${index}]`;
  default:
    return null;
  }
}

function logger({ getState }) {
  return (next) => (action) => {
    console.log("ACTION:", action.type, '→', action)
    
    const prevState = getState();
    const returnValue = next(action);
    const newState = getState();

    const diff = differ(prevState, newState);

    if (diff) {
      diff.forEach((elem) => {
        const { kind } = elem;
        const output = render(elem);
        let right = undefined
        switch (kind) {
          case 'E':
          case 'N':
              right = elem.rhs
            break;
          case 'A':
            if (typeof elem.item.rhs === 'object') {
              right = elem.item
            }
            else {
              right = elem.item.rhs
            }
            break;
          default:
            break;
        }

        console.log(`${dictionary[kind].text}`, action.type, output, right);
        
      });
    } 

    return returnValue;
  };
}

export default logger;