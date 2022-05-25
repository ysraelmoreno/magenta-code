const Magenta = require("./magenta");

const codes = `print "Hello world"
print "Hello again!"
32 + 22 35`;

const magenta = new Magenta(codes);

magenta.run();
