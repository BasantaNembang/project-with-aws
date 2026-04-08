import './FAB.css';

interface FABProps {
  onClick: () => void;
}

const FAB  = ({ onClick }: FABProps) => {
  return (
    <button className="fab" onClick={onClick} title="Add content">
      +
    </button>
  );
};

export default FAB;

