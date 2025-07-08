interface Props {
  placeholder?: string;
}

export const SearchBar = ({ placeholder = "Search..." }: Props) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="border rounded-lg px-4 py-2 w-full mb-4"
    />
  );
};
