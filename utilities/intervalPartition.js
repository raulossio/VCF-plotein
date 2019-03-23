import PriorityQueue from 'js-priority-queue'

const domainComparator = (a, b) => {
  if (a.start !== b.start) {
    return (a.start < b.start ? -1 : 1)
  }
  return (a.end < b.end ? -1 : 1)
}

const queueComparator = (a, b) => {
  return (a.end < b.end ? -1 : 1)
}

export default (domains) => {
  // https://www.algorithmsandme.com/interval-partitioning-problem/

  let sortedDomains = domains.sort(domainComparator)

  let num = 0
  let schedule = {}
  let pq = new PriorityQueue({ comparator: queueComparator })

  for (const job of sortedDomains) {
    if (pq.length === 0) {
      num += 1
      schedule[job.id] = num
      pq.queue({end: job.end, id: num})
    } else {
      let room = pq.dequeue()
      if (room.end <= job.start) {
        room.end = job.end
        schedule[job.id] = room.id
        pq.queue(room)
      } else {
        num += 1
        schedule[job.id] = num
        pq.queue(room)
        pq.queue({end: job.end, id: num})
      }
    }
  }

  return {num, schedule}
}
