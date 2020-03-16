import React from "react"
import { graphql } from "gatsby"
const Strings = require('string')

function getContent(node, type) {
  const dateLength = 11 // e.g. 09-Mar-2020
  // e.g. original source: `... Available Balance 263,178.4430-Dec-2019\r\n Credits11 ...]
  const targetStr = Strings(JSON.stringify(node)).between('Available Balance', 'Credits').s
  const amountStr = targetStr.substr(0, targetStr.indexOf('.') + 3)
  const dateStr = targetStr.substr(amountStr.length, dateLength)
  return type === 'amount' ? amountStr: dateStr
}

const pdfToTable = ({ data }) => (
  <div style={{
      margin: `0 auto`,
      maxWidth: 960,
      padding: `0 1.0875rem 1.45rem`,
    }}>
    <table>
      <thead>
        <tr>
          <td style={{
            'text-align': `center`,
            position: `sticky`,
            top: `0`,
            background: `lightgray`,
            opacity: .8
          }}>
          Date</td>
          <td style={{
            'text-align': `center`,
            position: `sticky`,
            top: `0`,
            background: `lightgray`,
            opacity: .8
          }}>
          Available Balance</td>
        </tr>
      </thead>
      <tbody>
        {
          data.allFile.edges.map(({ node }) => (
            <tr key={node.id}>
              <td style={{'text-align': `center`}}> { getContent(node, 'date') }</td>
              <td style={{'text-align': `center`}}> { getContent(node, 'amount') } </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)

export const query = graphql`
{
  allFile(sort: {order: ASC, fields: name}, filter: {name: {ne: "Account Statement"}, ext: {eq: ".pdf"}}) {
    edges {
      node {
        name
        childPdf {
          content
        }
      }
    }
  }
}
`

export default pdfToTable
