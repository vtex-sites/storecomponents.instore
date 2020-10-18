import React from 'react'
import reject from 'lodash/reject'
import matches from 'lodash/matches'
import concat from 'lodash/concat'
import uniqBy from 'lodash/uniqBy'
import orderBy from 'lodash/orderBy'
import filter from 'lodash/filter'
import * as CustomEvent from '@vtex/gatsby-theme-instore/utils/customEvent'
import { getInstoreConfig } from '@vtex/gatsby-theme-instore/utils/config'

import IdentifiedPerson from './IdentifiedPerson'

const TIME_TO_EXPIRE: number = getInstoreConfig().falcoTimeToExpire || 30000 // in miliseconds
const GARBAGECOLLECTOR_CYCLE_TIME = 5000 // also in miliseconds

interface Props {
  onSetCustomerIdentification: (id: string) => void // PropTypes.func,
  identification?: string // PropTypes.string,
  orderForm?: object // PropTypes.object,
}

type State = {
  identifications: IdentificationType[]
}

interface CustomEvent extends Event {
  data: { id: number | string }
}

export type IdentificationType = {
  firstName: string
  lastName: string
  photoUrl: string
  email: string
  timestamp?: number
  hasSameName?: boolean
}

interface IdentificationWithTimestampType extends IdentificationType {
  timestamp: number
}

export default class IdentificationByPicture extends React.Component<
  Props,
  State
> {
  private garbageCollector: number

  constructor(props: Props) {
    super(props)
    this.garbageCollector = 0
    this.state = {
      identifications: [],
    }
  }

  public componentDidMount(): void {
    CustomEvent.listenEvent('checkIn.falco', this.handleCheckIn)
  }

  public componentWillUnmount(): void {
    CustomEvent.unlistenEvent('checkIn.falco', this.handleCheckIn)
    window.clearInterval(this.garbageCollector)
  }

  public componentDidUpdate(): void {
    const { identifications } = this.state

    if (identifications.length === 0) {
      window.clearInterval(this.garbageCollector)
    } else if (!this.garbageCollector) {
      this.runGarbageCollector()
    }
  }

  public parseEvent(event: Event) {
    const cEvent = event as CustomEvent
    return JSON.parse(cEvent.data.id.toString())
  }

  public addTimestamp(id: Record<string, unknown>): IdentificationType {
    return {
      ...id,
      timestamp: new Date().getTime(),
    }
  }

  public isDifferentPersonWithSameName(
    person1: IdentificationType,
    person2: IdentificationType
  ): boolean {
    return (
      person1.firstName === person2.firstName && person1.email !== person2.email
    )
  }

  public addHasSameName(id: Record<string, unknown>): IdentificationType {
    return {
      ...id,
      hasSameName: true,
    }
  }

  public runGarbageCollector(): void {
    this.garbageCollector = window.setInterval(() => {
      const { identifications } = this.state

      if (identifications.length > 0) {
        const dateNow = new Date().getTime()

        identifications.map((id: IdentificationType): void => {
          const identification = id as IdentificationWithTimestampType

          if (dateNow - identification.timestamp >= TIME_TO_EXPIRE) {
            this.expirePerson(id)
          }

          return
        })
      }
    }, GARBAGECOLLECTOR_CYCLE_TIME)
  }

  public handleCheckIn(event: Event): void {
    const parsedEvent = this.parseEvent(event)

    if (parsedEvent === '') {
      // json parse failed or event is not CustomEvent
      return
    }

    let identification = this.addTimestamp(parsedEvent)
    let { identifications } = this.state

    // check if same name
    identifications = identifications.map((id) => {
      if (this.isDifferentPersonWithSameName(id, identification)) {
        identification = this.addHasSameName(identification)
        return this.addHasSameName(id)
      }
      return id
    })

    // make new state
    let newIdentifications = concat([identification], identifications)

    newIdentifications = orderBy(
      newIdentifications,
      [
        (item) => item.firstName,
        (item) => item.email,
        (item) => item.timestamp,
      ],
      ['asc', 'asc', 'desc']
    )
    newIdentifications = uniqBy(newIdentifications, (item) => item.email)
    this.setState({
      identifications: newIdentifications,
    })

    // starts garbage collector if there is not one running
    if (!this.garbageCollector) {
      this.runGarbageCollector()
    }
  }

  public expirePerson(id: IdentificationType) {
    const { email, firstName } = id
    let { identifications } = this.state

    identifications = reject(identifications, matches({ email }))

    const peopleWithSameName = filter(identifications, matches({ firstName }))

    if (peopleWithSameName.length === 1) {
      // last of it's firstName
      identifications = identifications.map((i: IdentificationType) => {
        if (i.firstName === firstName) {
          delete i.hasSameName
        }

        return i
      })
    }

    this.setState({ identifications })
  }

  public render(): React.ReactNode {
    const { identifications } = this.state

    return (
      <div className="">
        {identifications?.length ? (
          <div className="pl5 pr5 mb5-ns overflow-y-auto pre flex justify-center hide-scrollbar">
            {identifications.map((identification, index) => {
              return (
                <IdentifiedPerson
                  onSetCustomerIdentification={
                    this.props.onSetCustomerIdentification
                  }
                  identification={identification}
                  key={index}
                />
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }
}
