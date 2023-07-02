import { Express, NextFunction, Request, Response } from 'express'
import { CustomRequest, verifyAccessToken } from './middlewares'
import createHttpError from 'http-errors'
import { ProductService } from '@/services'
import { publishCustomerEvent } from '@/utils'

export const productAPI = (app: Express) => {
  const service = new ProductService()

  app.get(`/`, async (_req: Request, res: Response, next: NextFunction) => {
    service
      .GetProductsAndCategories()
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        next(err)
      })
  })
  app.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    service
      .GetProductById(req.params.id)
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        next(err)
      })
  })

  app.post(
    '/product/create',
    async (req: Request, res: Response, next: NextFunction) => {
      service
        .CreateProduct(req.body)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((err) => {
          next(err)
        })
    }
  )

  app.get(
    '/category/:type',
    async (req: Request, res: Response, next: NextFunction) => {
      service
        .GetProductsByCategory(req.params.type)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((err) => {
          next(err)
        })
    }
  )

  app.post(
    '/wishlist',
    verifyAccessToken,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user

        const payload = await service.GetProductPayload(
          id,
          { productId: req.body.id },
          'ADD_TO_WISHLIST'
        )

        if (payload) {
          await publishCustomerEvent(payload)
          // PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data))

          return res.status(200).json(payload.data.product)
        } else throw createHttpError.NotFound('Product not found')
      } catch (error) {
        next(error)
      }
    }
  )

  app.get('/whoami', (_req: Request, res: Response) => {
    return res.status(200).json({ msg: '/product : I am Product Service' })
  })

  app.all('*', (req: CustomRequest, _res: Response, next: NextFunction) => {
    next(
      createHttpError.NotFound(
        `No resource for ${req.method} to ${req.originalUrl}`
      )
    )
  })
}
