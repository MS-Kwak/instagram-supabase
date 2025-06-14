'use clinet';

export default function Message({ isFromMe, message }) {
  return (
    <div
      className={`w-fit p-3 rounded-md ${
        isFromMe
          ? 'bg-blue-500 text-white ml-auto'
          : 'bg-gray-100 text-black mr-auto'
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
