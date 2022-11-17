const { getWeth } = require("./getWeth")

async function main() {
   await getWeth()
}


main()
   .then(() => process.exit(0))
   .catch(err => {
      console.error(err)
      process.exit(1)
   })