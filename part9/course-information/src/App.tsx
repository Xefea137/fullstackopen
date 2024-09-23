interface HeaderProps {
  name: string  
};

const Header = (props: HeaderProps): JSX.Element => {
  return <h1>{props.name}</h1>;
};

interface ContentProps {
  parts: {
    name: string,
    exerciseCount: number
  }[]
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.parts.map(p => (
        <p key={p.name}>{p.name} {p.exerciseCount}</p>
      ))}
    </div>
  );
};

const Total = ({total}: {total: number}) => {
  return <p>Number of exercises {total}</p>; 
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;