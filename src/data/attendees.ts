import { faker } from '@faker-js/faker'

export const attendees = Array.from({ length: 205 }).map(() => {
  return {
    id: faker.number.int({ min: 10000, max: 20000 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createAt: faker.date.recent({ days: 30 }).toISOString(),
    checkedInAt: faker.date.recent({ days: 7 }).toISOString(),
  }
})
