/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import * as db from '../data/mongodb'

// NEW ENDPOINT: Search orders by email
// VULNERABLE: NoSQL injection via $where operator with unvalidated user input
export function searchOrders () {
  return (req: Request, res: Response) => {
    const email = req.query.email || ''

    // VULNERABILITY: Direct string interpolation in MongoDB $where clause
    // Allows arbitrary JavaScript execution in MongoDB context
    db.ordersCollection.find({
      $where: `this.email.includes('${email}')`
    }).then((orders: any) => {
      res.json(orders)
    }).catch(() => {
      res.status(400).json({ error: 'Search failed' })
    })
  }
}
