// Warehouse stock transition rules. Persist atomically with a locked balance row
// and unique event ID; never accept a client-supplied balance as authoritative.
const kinds = new Set(['receive','reserve','release','dispatch','damage','return','restore']);
export function applyStockEvent(balance, kind, quantity) {
  if (!kinds.has(kind) || !Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('Invalid stock event');
  const {onHand,reserved,damaged}=balance;
  if (![onHand,reserved,damaged].every(n=>Number.isSafeInteger(n)&&n>=0)||reserved+damaged>onHand) throw new Error('Invalid balance');
  const b={onHand,reserved,damaged};
  switch(kind){
    case 'receive': b.onHand+=quantity; break;
    case 'reserve': b.reserved+=quantity; break;
    case 'release': b.reserved-=quantity; break;
    case 'dispatch': b.reserved-=quantity; b.onHand-=quantity; break;
    case 'damage': b.damaged+=quantity; break;
    case 'return': b.onHand+=quantity; b.damaged+=quantity; break;
    case 'restore': b.damaged-=quantity; break;
  }
  if (![b.onHand,b.reserved,b.damaged].every(n=>Number.isSafeInteger(n)&&n>=0)||b.reserved+b.damaged>b.onHand) throw new Error('Insufficient stock');
  return {...b,available:b.onHand-b.reserved-b.damaged};
}
