const CartItem: React.FC<{ item: CartItem; onIncrease: () => void; onDecrease: () => void; onRemove: () => void; }> = ({ item, onIncrease, onDecrease, onRemove }) => {
    const matchingAsset = assets.find((asset) => asset.id === item.id);
    if (!matchingAsset) return null;
  
    return (
      <div key={item.id} className="flex items-center mb-5">
        <Image src={matchingAsset.image} alt={matchingAsset.name} width={100} height={100} className="object-cover" />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{matchingAsset.name}</h2>
          <p className="text-lg font-medium">${matchingAsset.price} x {item.quantity}</p>
          <p className="text-lg font-medium">Subtotal: ${(matchingAsset.price * item.quantity).toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <button className="p-2 bg-gray-700 text-white rounded-l" onClick={onDecrease}><FaMinus /></button>
            <span className="p-2 bg-gray-800 text-white">{item.quantity}</span>
            <button className="p-2 bg-gray-700 text-white rounded-r" onClick={onIncrease}><FaPlus /></button>
            <button className="ml-4 p-2 bg-red-600 text-white rounded" onClick={onRemove}><FaTrashAlt /></button>
          </div>
        </div>
      </div>
    );
  };