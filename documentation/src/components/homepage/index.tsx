import Link from '@docusaurus/Link'
import React from 'react'

import './style.css'

const COMPS = [
  {
    comp: 'Switch/Toggle',
    link: '/components/switch'
  },
  {
    comp: 'Tabs',
    link: '/components/tabs'
  },

  {
    comp: 'Modal',
    link: '/components/modal'
  },
  {
    comp: 'Alert',
    link: '/components/alert'
  },
  {
    comp: 'Alert Dialog',
    link: '/components/alert-dialog'
  },
  {
    comp: 'Radio Group',
    link: '/components/radio-group'
  }
]

function HomePage() {
  return (
    <div>
      <div className='container hero'>
        <div className='hero-banner'>
          <h1 className='hero-header'>
            Reusable and easy to use UI Components
          </h1>
          <h4 className='hero-sub-header'>
            An Accessible, unstyled, open-sourced and fully functional react
            component library for building design systems
          </h4>
          <Link
            to='/components/alert'
            className='button button--primary button--lg home-btn'
          >
            Explore Components
          </Link>
        </div>
        <img src='/img/banner.svg' alt='banner iamge' />
      </div>

      <div className='hero-footer'>
        <div className='container'>
          <h2 className='footer-header'>Components</h2>
          <div className='component-wrapper'>
            <div className='row component-row'>
              {COMPS.map(({ comp, link }, i) => (
                <Link to={link} key={comp}>
                  <div>
                    <img src={`/img/homepage/comp-${i + 1}.svg`} />
                    <p>{comp}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to='/components/accordion'
              className='button button--primary button--lg home-btn'
            >
              View all components
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export { HomePage }
