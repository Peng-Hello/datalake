import { ElMessage } from 'element-plus'
import type { ServerException } from '@/ts/data-wrangler/exception'

/**
 * Find the root cause from ServerException
 * @param exception chained exception
 */
export function findRootCause(exception: ServerException | undefined): string {
  if (exception === undefined) {
    return ''
  }

  if (exception.cause === null) {
    return exception.message
  } else {
    return findRootCause(exception.cause)
  }
}

/**
 * Create a popup message
 * @param message
 * @param type
 * @param duration
 * @param useHTML is message as HTML format
 */
function createMessage(
  message: string,
  type: 'warning' | 'success' | 'info' | 'error' = 'info',
  duration: 'long' | 'default' = 'default',
  useHTML: boolean = false
) {
  if (duration == 'default') {
    ElMessage({
      message: message,
      type: type,
      dangerouslyUseHTMLString: useHTML
    })
  } else {
    ElMessage({
      message: message,
      type: type,
      duration: 5000,
      dangerouslyUseHTMLString: useHTML
    })
  }
}
export function warningMessage(
  message: string,
  duration: 'long' | 'default' = 'default',
  useHTML: boolean = false
) {
  createMessage(message, 'warning', duration, useHTML)
}

export function successMessage(
  message: string,
  duration: 'long' | 'default' = 'default',
  useHTML: boolean = false
) {
  createMessage(message, 'success', duration, useHTML)
}

export function infoMessage(
  message: string,
  duration: 'long' | 'default' = 'default',
  useHTML: boolean = false
) {
  createMessage(message, 'info', duration, useHTML)
}

export function errorMessage(
  message: string,
  duration: 'long' | 'default' = 'default',
  useHTML: boolean = false
) {
  createMessage(message, 'error', duration, useHTML)
}

export function unexpectedErrorMessage(location: string, useHTML: boolean = false) {
  errorMessage(`Unexpected error [at ${location}]`, 'long', useHTML)
}

export function resetButtonState(event: Event) {
  let target = event.target as any
  if (target.nodeName === 'SPAN') {
    target = target.parentNode
  }
  target.blur()
}

export const notImplementedMessage = () => {
  warningMessage('逻辑还未实现！')
}
