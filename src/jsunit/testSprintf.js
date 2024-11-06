const sprintf = require("sprintf-js").sprintf;

const user = {
  name: "Dolly",
  height: 1.81,
};

console.log(`test sprintf`);
console.log(sprintf("%(name)s is %(height).2f m height, %(name)s", user));
