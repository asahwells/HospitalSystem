const styles = (theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      width: 151,
    },
    title: {
      fontSize: 18,
    },
    card: {
      marginTop: 16,
    },
    mb8: {
      marginBottom: 8,
    },
    value: {
      color: "#212121",
      float: "right",
      marginRight: 10,
    },
    addbtn: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      paddingTop: 8,
      [theme.breakpoints.up("md")]: {
        width: "80%",
      },
    },
    rotate: {
      animation: `$rotates 1s linear infinite`,
    },
    "@keyframes rotates": {
      "100%": {
        transform: " rotate(360deg)",
      },
    },
    textarea: {
      width: "100%",
    },
    visible: {
      fontSize: 14,
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    addDrug: {
      display: "flex",
      alignItems: "center",
    },
  })
  export default styles
  