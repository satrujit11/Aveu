const Navigation = ({ navigationData, setTab, tab }: any) => {
  const handleOnClick = (id: string) => {
    setTab(id);
  };

  return (
    <ul
      className="grid"
      style={{
        gridTemplateColumns: "repeat(" + navigationData.length + ", 1fr)",
      }}
    >
      {navigationData.map((data: any) => (
        <li
          key={data.id}
          onClick={() => handleOnClick(data.id)}
          className={`p-2 text-center cursor-pointer font-bold ${
            tab === data.id
              ? "bg-primary_light text-secondary border-b-2 border-secondary rounded-t transition-colors"
              : "text-secondary hover:saturate-200 rounded duration-300 transition-colors"
          }`}
        >
          {data.name}
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
