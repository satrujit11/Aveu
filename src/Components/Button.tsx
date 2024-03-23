
const Button = (props: any) => {
  return (
    <button
      className="bg-secondary text-[#ffffff] font-bold py-4 px-6 rounded-lg w-full hover:saturate-200"
      {...props}
    >
      {props.children}
    </button>
  );
}

export default Button
