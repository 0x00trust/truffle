const MemoryLogger = require("../MemoryLogger");
const CommandRunner = require("../commandRunner");
const Reporter = require("../reporter");
const Server = require("../server");
const path = require("path");
const sandbox = require("../sandbox");
const fs = require("fs-extra");

describe("Genesis time config for truffle test, passing tests [ @standalone ]", function () {
  const logger = new MemoryLogger();
  let config;

  before(async function () {
    await Server.start();
  });
  after(async function () {
    await Server.stop();
  });

  describe("test with valid date", function () {
    before("set up sandbox", function () {
      this.timeout(10000);
      let project = path.join(
        __dirname,
        "../../sources/genesis_time/genesis_time_valid"
      );
      return sandbox.create(project).then(conf => {
        config = conf;
        config.network = "test";
        config.logger = logger;
        config.mocha = {
          reporter: new Reporter(logger)
        };
      });
    });

    before("ensure path", async () => {
      await fs.ensureDir(config.test_directory);
    });

    it("will run test and error should be undefined", async function () {
      this.timeout(90000);
      await CommandRunner.run("test", config);
    });
  });
});
