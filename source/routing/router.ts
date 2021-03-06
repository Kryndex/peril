import winston from "../logger"

import db from "../db"
import { createInstallation } from "../github/events/create_installation"
import { githubDangerRunner } from "../github/events/github_runner"
import { ping } from "../github/events/ping"

import { RootObject as InstallationCreated } from "../github/events/types/integration_installation_created.types"
import { RootObject as PR } from "../github/events/types/pull_request_opened.types"

/** Logs */
const info = (message: string) => { winston.info(`[router] - ${message}`) }

const router = (req, res, next) => {
  const event = req.header("X-GitHub-Event")
  winston.log("router", `Recieved ${event}:`)

  githubRouting(event, req, res, next)
}

export const githubRouting = (event, req, res, next) => {
  switch (event) {
    case "ping": {
      ping(req, res)
      break
    }

    case "integration_installation": {
      const request = req.body as InstallationCreated
      const action = request.action
      const installation = request.installation
      // Create a db entry for any new integrations
      if (action === "created") {
        info(` - Creating new integration`)
        createInstallation(installation, req, res)
      }

      // Keep our db up to date as repos are added and removed
      if (action === "added") {
        info(` - Updating repos for integration`)

        // request.repositories_added
        // request.repositories_removed
      }

      // Delete any integrations that have uninstalled Peril :wave:
      if (action === "deleted") {
        info(` - Deleting integration ${installation.id}`)
        db.deleteInstallation(installation.id)
      }

      break
    }

    default: {
      info(` - passing to Dangerfile rule router`)
      // throw "NO"
      githubDangerRunner(event, req, res, next)
    }
  }
}

export default router
