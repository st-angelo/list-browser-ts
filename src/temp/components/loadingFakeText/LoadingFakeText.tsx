import grey from '@material-ui/core/colors/grey';
import { Paper, makeStyles } from '@material-ui/core';

const styles = {
  wrapper: {
    width: '100%'
  },
  fake: ({ animated = true, rounded = true }) => ({
    backgroundColor: grey[200],
    height: 10,
    margin: 20,
    animation: animated ? '$fade 1.4s linear infinite' : 'none',
    borderRadius: rounded ? '100vw' : 'none',
    // Selects every two elements among any group of siblings.
    '&:nth-child(2n)': {
      marginRight: '20%'
    }
  }),
  fakeTextPaper: {
    padding: '10px',
    borderRadius: '6px'
  },
  '@keyframes fade': {
    // Using a function instead of an object is a workaround for a bug in @material-ui v4: When using styles based
    // on props (animated, rounded), animations don't work anymore (https://github.com/mui/material-ui/issues/16673)
    '0%': () => ({ opacity: 0.4 }),
    '50%': () => ({ opacity: 1 }),
    '100%': () => ({ opacity: 0.4 })
  }
};

const useStyles = makeStyles(styles);

function LoadingFakeText({ lines = 4, onPaper = false, animated = true, rounded = true }) {
  const classes = useStyles({ animated, rounded });
  const fakeText = (
    <div className={classes.wrapper}>
      {[...Array(lines)].map((e, i) => (
        <div className={classes.fake} key={i}></div>
      ))}
    </div>
  );

  if (onPaper) {
    return <Paper className={classes.fakeTextPaper}>{fakeText}</Paper>;
  }

  return fakeText;
}

export default LoadingFakeText;
