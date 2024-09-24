const App = () => {
  interface HeaderProps {
    name: string  
  };
  
  const Header = (props: HeaderProps): JSX.Element => {
    return <h1>{props.name}</h1>;
  };

  const assertNever = (value: never) => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
  };
  
  const Part = ({ part }: { part: CoursePart}) => {
    switch (part.kind) {
      case "basic":
        return (
          <p>
            <strong>{part.name} {part.exerciseCount}</strong><br />
            <i>{part.description}</i>
          </p>
        )
      case "group":
        return (
          <p>
            <strong>{part.name} {part.exerciseCount}</strong><br />
            Project exercises {part.groupProjectCount}
          </p>
        )
      case "background":
        return (
          <p>
            <strong>{part.name} {part.exerciseCount}</strong><br />
            <i>{part.description}</i><br />
            Submit to {part.backgroundMaterial}
          </p>
        )
      case "special":
        return (
          <p>
            <strong>{part.name} {part.exerciseCount}</strong><br />
            <i>{part.description}</i><br />
            Required skills: {part.requirements.join(", ")}
          </p>
        )
      default:
        return assertNever(part)
    }
  }

  interface ContentProps {
    parts: CoursePart[]
  };
  
  const Content = (props: ContentProps) => {
    return (
      <div>
        {props.parts.map(p => (
          <Part key={p.name} part={p} />
        ))}
      </div>
    );
  };
  
  const Total = ({total}: {total: number}) => {
    return <p>Number of exercises {total}</p>; 
  };

  const courseName = "Half Stack application development";

  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

  interface coursePartDescription extends CoursePartBase {
    description: string
  }
  
  interface CoursePartBasic extends coursePartDescription {
    kind: "basic"
  }
  
  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }

  interface CoursePartSpecial extends coursePartDescription {
    requirements: string[],
    kind: "special"
  }
  
  interface CoursePartBackground extends coursePartDescription {
    backgroundMaterial: string;
    kind: "background"
  }  
  
  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;
  
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    },
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