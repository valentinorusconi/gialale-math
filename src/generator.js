export default function getExcercise(level) {
  let exercise;

  switch (level) {
    case 1:
      exercise = `${getRndNum()}x-${getRndNum()} = ${getRndNum(
        20
      )} - ${getRndNum()}x`;
      break;

    case 2:
      const rndNum1 = getRndNum();
      exercise = `\\frac{${getRndNum()}x}{${rndNum1}} + ${getRndNum()} = \\frac{${getRndNum()}x}{${rndNum1}} + ${getRndNum()}`;
      break;

    case 3:
      const rndNum = getRndNum();
      exercise = `(${getRndNum()}+x)^2 = (x+${rndNum})(x-${rndNum})`;
      break;

    default:
  }
  return exercise;
}

function getRndNum(max) {
  if (!max) {
    max = 4;
  }
  return Math.floor(Math.random() * max + 1);
}
