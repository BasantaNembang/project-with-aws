import { formatDistanceToNow } from "date-fns";

const TimeStamp = ({ time }) => {
    if (!time) return null;

    // Remove nanoseconds (keep milliseconds only)
    const safeTime = time.includes('.')
        ? time.split('.')[0] + 'Z'
        : time;

    const timeAgo = formatDistanceToNow(new Date(safeTime), {
        addSuffix: true,
    });

    return <div>{timeAgo}</div>;
};

export default TimeStamp;



