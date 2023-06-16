const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="walking">
        <div className="head"></div>
        <div className="body"></div>
        <div className="firstLeg"></div>
        <div className="secondLeg"></div>
        <div className="shadow"></div>
      </div>
      <p className="tracking-widest text-xl mt-6">LOADING...</p>
      <p className="tracking-wide text-xs mx-4 text-center">
        In life sometimes you just have to wait, this is that time
      </p>
    </div>
  );
};

export default Loader;
