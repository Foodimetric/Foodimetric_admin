interface Props {
  placeholder?: string;
  onSearch: (term: string) => void;
}

export const SearchBar = ({ placeholder, onSearch }: Props) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full p-3 mb-4 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-300"
    />
  );
};
