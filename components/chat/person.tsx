import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Person({
  index,
  userId,
  name,
  onlineAt,
  isActive = false,
  onChatScreen = false,
  onClick = null,
}) {
  return (
    <div
      className={`flex w-full min-w-60 gap-4 items-center p-4 ${
        onClick && 'cursor-pointer'
      } ${!onChatScreen && isActive && 'bg-blue-200'} ${
        !onChatScreen && !isActive && 'bg-gray-50'
      } ${onChatScreen && 'bg-gray-50'}`}
      onClick={onClick}
    >
      <Image
        src={`/puppy${index}.png`}
        alt={`user`}
        width={50}
        height={50}
        className="rounded-full"
      />
      <div>
        <p className="text-bold text-black text-lg">{name}</p>
        <p className="text-gray-500 text-sm">
          {onlineAt && dayjs(onlineAt).fromNow()}
        </p>
      </div>
    </div>
  );
}
