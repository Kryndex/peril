import { GitHubInstallation } from "../../../db"
import { GitHubRunSettings, runsForEvent } from "../github_runner"

const defaultRun = {
  commentableID: 2,
  hasRelatedCommentable: true,
  isRepoEvent: true,
  isTriggeredByUser: true,
  repo: {
    fullName: "danger/peril",
    id: 1,
    installationID: 12,
    rules: {
      pull_request: "pr.ts",
    },
  },
  repoName: "danger/peril",
  triggeredByUsername: "orta",
}

const getSettings = (overwrites) => ({
  ...defaultRun,
  ...overwrites,
})

it("gets the expected runs for platform", () => {
  const installation: GitHubInstallation = {
    id: 12,
    rules: {
      pull_request: "orta/peril-dangerfiles@pr.ts",
    },
    settings: {},
  }

  const settings = getSettings({})

  const runs = runsForEvent("pull_request", "created", installation, settings)
  expect(runs).toEqual([
    {
      action: "created",
      dangerfilePath: "pr.ts",
      dslType: 0,
      event: "pull_request",
      feedback: 0,
      repoSlug: "orta/peril-dangerfiles",
    },
    {
      action: "created",
      dangerfilePath: "pr.ts",
      dslType: 0,
      event: "pull_request",
      feedback: 0,
    },
  ])
})

it("handles a platform only run", () => {
  const installation = {
    id: 12,
    rules: {
      pull_request: "orta/peril-dangerfiles@pr.ts",
    },
    settings: {},
  }

  const settings = getSettings({ repo: null, repoNmae: null })

  const runs = runsForEvent("pull_request", "created", installation, settings)
  expect(runs).toEqual([
    {
      action: "created",
      dangerfilePath: "pr.ts",
      dslType: 0,
      event: "pull_request",
      feedback: 0,
      repoSlug: "orta/peril-dangerfiles",
    },
  ])
})

it("gets the expected runs for platform", () => {
  const installation = {
    id: 12,
    rules: {
      pull_request: "orta/peril-dangerfiles@pr.ts",
    },
    settings: {},
  }

  const repo = {
    fullName: "danger/peril",
    id: 1,
    installationID: 12,
    rules: {
      issues: "pr.ts",
    },
  }

  const settings = getSettings({ repo, repoName: repo.fullName })

  const runs = runsForEvent("issues", "created", installation, settings)
  expect(runs).toEqual([
    {
      action: "created",
      dangerfilePath: "pr.ts",
      dslType: 1,
      event: "issues",
      feedback: 0,
    },
  ])
})
