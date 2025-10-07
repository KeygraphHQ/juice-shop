/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { BasketModel } from '../models/basket'
import * as security from '../lib/insecurity'
import * as models from '../models/index'

export function applyCoupon () {
  return async ({ params }: Request, res: Response, next: NextFunction) => {
    try {
      const id = params.id
      let coupon: string | undefined | null = params.coupon ? decodeURIComponent(params.coupon) : undefined
      const discount = security.discountFromCoupon(coupon)
      coupon = discount ? coupon : null

      const basket = await BasketModel.findByPk(id)
      if (!basket) {
        next(new Error(`Basket with id=${id} does not exist.`))
        return
      }

      await basket.update({ coupon: coupon?.toString() })
      if (discount) {
        return res.json({ discount })
      } else {
        return res.status(404).send('Invalid coupon.')
      }
    } catch (error) {
      next(error)
    }
  }
}

// NEW ENDPOINT: Lookup coupon details by code
// VULNERABLE: SQL injection via template literal string interpolation
export function lookupCouponByCode () {
  return (req: Request, res: Response, next: NextFunction) => {
    const code = req.query.code || ''

    // VULNERABILITY: Direct template literal interpolation in raw SQL query
    // No parameterization - allows SQL injection attacks
    models.sequelize.query(`SELECT * FROM Coupons WHERE code = '${code}'`)
      .then(([coupons]: any) => {
        res.json(coupons)
      }).catch((error: Error) => {
        next(error)
      })
  }
}
