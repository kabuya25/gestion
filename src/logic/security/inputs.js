import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
import SqlString from 'sqlstring'

const window = (new JSDOM()).window
const domsanitize = DOMPurify(window)


export const check_inputs =  (inputs) => {
    return SqlString.escape(domsanitize.sanitize(inputs))
}