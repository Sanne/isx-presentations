// Terminal scenes told on the slides, one step per click.
//
// These are stylised reconstructions of an agent session, not screenshots of
// any one tool: plausible enough that the audience recognises their own week,
// and never showing a behaviour the tools don't have. Anything that needs
// measuring before it goes in front of an audience says so in the slide's
// speaker notes.

export type Line =
  | { t: 'user'; text: string }      // what you typed
  | { t: 'agent'; text: string }     // the agent talking
  | { t: 'run'; text: string }       // a command that ran without asking
  | { t: 'ask'; text: string; why?: string }  // a permission prompt
  | { t: 'out'; text: string }       // command output
  | { t: 'err'; text: string }       // a failure
  | { t: 'note'; text: string }      // the narrator: time passing, asides

export interface Scene {
  title: string
  // Show a running count of the prompts you've answered.
  counter?: boolean
  // steps[0] is on screen when the slide opens; each click reveals the next.
  steps: Line[][]
}

const user = (text: string): Line => ({ t: 'user', text })
const agent = (text: string): Line => ({ t: 'agent', text })
const run = (text: string): Line => ({ t: 'run', text })
const ask = (text: string, why?: string): Line => ({ t: 'ask', text, why })
const out = (text: string): Line => ({ t: 'out', text })
const err = (text: string): Line => ({ t: 'err', text })
const note = (text: string): Line => ({ t: 'note', text })

export const scenes: Record<string, Scene> = {
  // Act 1: the first afternoon with an agent.
  fixTest: {
    title: 'agent — ~/src/shop',
    counter: true,
    steps: [
      [user('Fix the failing test in PriceCalculatorTest'), agent("I'll run the tests first."), ask('mvn -q test')],
      [out('Tests run: 42, Failures: 1  (expected 90.0, got 110.0)'), agent('Let me check which dependency versions are in play.'), ask('mvn -q dependency:tree')],
      [agent('The discount is added instead of subtracted. Fixing it, then re-running that test.'), ask('mvn -q test -Dtest=PriceCalculatorTest')],
      [out('Tests run: 1, Failures: 0'), agent('Running the full suite to be safe.'), ask('mvn -q test')],
      [out('Tests run: 42, Failures: 0'), agent('Committing the fix.'), ask('git commit -am "Fix discount sign"')],
      [out('[main 3f2a91c] Fix discount sign'), note('Five approvals. The fix was one character.')],
    ],
  },

  // Act 1: you try to leave it alone.
  coffee: {
    title: 'agent — ~/src/shop',
    steps: [
      [user('Upgrade to the latest Quarkus and fix whatever breaks'), agent('Starting with the version property.'), ask('./mvnw versions:update-property -Dproperty=quarkus.version')],
      [note('10:02 — you go and get a coffee')],
      [note('10:31 — you come back'), note('It has been waiting for you for 29 minutes.')],
    ],
  },

  // Act 1: the allowlist you built yesterday doesn't come with you.
  // Claude Code saves "don't ask again" rules per repository and command.
  nextRepo: {
    title: 'agent — ~/src/orders',
    counter: true,
    steps: [
      [note('Tuesday. A different repository: yesterday\'s list stayed behind.'), user('Add a Postgres-backed test for the order history'), agent('This project builds with Gradle.'), ask('./gradlew test')],
      [agent('The test needs a database.'), ask('podman run -d -p 5432:5432 postgres:17')],
      [agent('And the frontend dependencies.'), ask('npm ci')],
      [note("Every new project, tool or host is a new prompt. You're babysitting again.")],
    ],
  },

  // Act 1: the process sandbox, and a task that needs a real machine.
  // `make images` measured at ~15 minutes with dependencies in place
  // (2026-09-25); the other durations are estimates.
  // OpenJDK's configure stops at the first missing library, so the agent
  // meets them one at a time, and each fix needs sudo.
  openjdkSandbox: {
    title: 'agent (process sandbox) — ~/src/shop',
    counter: true,
    steps: [
      [note('10:00'), user('Build OpenJDK with my patch and run our test suite on it'), agent("I'll get the sources."), ask('git clone https://github.com/openjdk/jdk', 'new host: github.com')],
      [agent('It needs a boot JDK.'), ask('curl -LO https://download.java.net/…', 'new host: download.java.net')],
      [run('bash configure --with-boot-jdk=…'), err('configure: error: Could not find cups!'), ask('sudo dnf install cups-devel', 'run outside the sandbox')],
      [run('bash configure --with-boot-jdk=…'), err('configure: error: Could not find fontconfig!'), ask('sudo dnf install fontconfig-devel', 'run outside the sandbox')],
      [run('bash configure --with-boot-jdk=…'), err('configure: error: Could not find alsa!'), ask('sudo dnf install alsa-lib-devel', 'run outside the sandbox')],
      [run('make images'), note("10:24 — still building. You haven't left your desk.")],
      [agent('Now the test suite on the patched JDK.'), run('mvn verify'), err('Could not find a valid Docker environment'), ask('mvn verify', 'run outside the sandbox')],
      [out('Tests run: 1,284, Failures: 0'), note('10:36 — done. Six approvals, and 36 minutes of your attention.')],
    ],
  },

  // Act 1 payoff: the same task on an isx machine. Same bumps, no stops.
  openjdkIsx: {
    title: 'agent — isx machine agent-1',
    counter: true,
    steps: [
      [note('10:00'), user('Build OpenJDK with my patch and run our test suite on it'), run('git clone https://github.com/openjdk/jdk'), run('curl -LO https://download.java.net/…')],
      [run('bash configure --with-boot-jdk=…'), err('configure: error: Could not find cups!'), run('sudo dnf install -y cups-devel'), run('bash configure --with-boot-jdk=…'), err('configure: error: Could not find fontconfig!'), run('sudo dnf install -y fontconfig-devel alsa-lib-devel')],
      [run('bash configure --with-boot-jdk=…  && make images'), run('mvn verify'), out('Tests run: 1,284, Failures: 0')],
      [agent('Done. The patch and the test results are committed on this branch.'), note("10:24 — done. Zero approvals. You weren't here.")],
    ],
  },

  // Act 3: getting the work back is plain git. Run on the host.
  // isx's own output lines are paraphrased, not verbatim.
  gitLoop: {
    title: 'you — ~/src/shop (your laptop)',
    steps: [
      [run('isx branch agent-1 --from tpl-java'), out("agent-1 is ready · git remote 'agent-1' added to ~/src/shop")],
      [run('git remote -v | grep agent-1'), out('agent-1   isx://agent-1/~/shop (fetch)')],
      [run('git fetch agent-1'), out(' * [new branch]      main       -> agent-1/main'), run('git diff --stat main agent-1/main'), out(' src/main/java/demo/PriceCalculator.java | 2 +-')],
      [run('git cherry-pick agent-1/main'), run('isx destroy agent-1'), out("agent-1 destroyed · git remote 'agent-1' removed from ~/src/shop")],
    ],
  },

  // Act 3: your laptop's environment, as every process the agent runs sees it.
  secretsLaptop: {
    title: 'agent — ~/src/shop',
    steps: [
      [run('env | grep -E "TOKEN|KEY"')],
      [out('GH_TOKEN=ghp_9Kx2…'), out('ANTHROPIC_API_KEY=sk-ant-api03-R7f…'), out('NPM_TOKEN=npm_4tQ…')],
      [note('The agent, its tests, every build plugin and every dependency it runs can read these.')],
    ],
  },

  // Act 3 payoff: the same look from inside an isx machine.
  secretsIsx: {
    title: 'agent — isx machine agent-1',
    steps: [
      [run('env | grep -E "TOKEN|KEY"')],
      [out('GH_TOKEN=gho_placeholder')],
      [agent('Yet everything authenticates:'), run('gh api user --jq .login'), out('shop-ai-bot')],
      [note('No real credential inside. And it acts as its own account, not as you.')],
    ],
  },
}
