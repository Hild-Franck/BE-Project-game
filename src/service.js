import logger from './logger'
import { start, answer } from './actions'

const brokerLogger = logger.child({ label: "broker" })

const errorHandler = (ctx, err) => {
	brokerLogger.error(`[${ctx.action.name}] ${err.message}`)
	throw err
}

const service = {
	name: 'game',
	actions: { start, answer },
	hooks: {
		error: {
			"*": errorHandler
		}
	}
}

export default service