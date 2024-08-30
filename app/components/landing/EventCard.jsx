import Image from 'next/image';
import Link from 'next/link';
import ActionButtons from '../ActionButtons';

const EventCard = ({event}) => {

  const {_id,name,location,imageUrl,interested_ids,going_ids} = event;

  return (
    <div className="overflow-hidden rounded-md bg-[#242526]">
      <Image
        src={imageUrl}
        alt={name}
        className="w-full md:h[320px] h-[250px] object-cover"
        width={500}
        height={500}
      />

      <div className="p-3">
        <Link href={`/details/${_id}`}className="font-bold text-lg hover:text-yellow-500">
         {name}
        </Link>
        <p className="text-[#9C9C9C] text-sm mt-1">
          {location}
        </p>
        <div className="text-[#737373] text-sm mt-1">
          <span>{interested_ids?.length} Interested</span>
          <span className='mx-1'>|</span>
          <span>{going_ids?.length} Going</span>
        </div>
        <ActionButtons />
      </div>
    </div>
  );
};

export default EventCard;
