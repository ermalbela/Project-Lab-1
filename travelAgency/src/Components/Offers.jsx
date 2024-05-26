import React, { useState } from 'react';
import '../global-styles/offers.css';
import FullScreenModal from './ui/FullScreenModal';
import CreateOffers from './offers/CreateOffers';

const Offers = () => {
  const allDummyData = [
    {
      id: 1,
      photo:
        'https://www.theadventurousflashpacker.com/wp-content/uploads/2018/08/70E4F074-F932-4D78-9B8F-55E384E6984F.jpeg',
      title: 'Maldive',
      desc: 'The Maldives is a tropical paradise in the Indian Ocean known for its stunning white-sand beaches, crystal-clear turquoise waters, and vibrant coral reefs teeming with marine life.',
      oldPrice: '5.000',
      price: '3.000',
    },
    {
      id: 2,
      photo:
        'https://www.theadventurousflashpacker.com/wp-content/uploads/2018/08/70E4F074-F932-4D78-9B8F-55E384E6984F.jpeg',
      title: 'Albania',
      desc: 'Albania, located in Southeast Europe on the Balkan Peninsula, is a country known for its rich history, diverse landscapes, and vibrant culture. It boasts stunning Adriatic and Ionian coastlines',
      oldPrice: '5.000',
      price: '3.000',
    },
    {
      id: 3,
      photo:
        'https://www.theadventurousflashpacker.com/wp-content/uploads/2018/08/70E4F074-F932-4D78-9B8F-55E384E6984F.jpeg',
      title: 'London',
      desc: 'London, the capital of the United Kingdom, is a vibrant metropolis known for its rich history, iconic landmarks, and diverse culture. Home to famous sites like the Tower of Londo.',
      oldPrice: '5.000',
      price: '3.000',
    },
    {
      id: 4,
      photo:
        'https://www.theadventurousflashpacker.com/wp-content/uploads/2018/08/70E4F074-F932-4D78-9B8F-55E384E6984F.jpeg',
      title: 'Salzburg',
      desc: 'Salzburg, located in Austria, is a picturesque city renowned for its baroque architecture, stunning alpine scenery, and rich musical heritage.',
      oldPrice: '5.000',
      price: '3.000',
    },
  ];

  const [modalShow, setModalShow] = useState(false);

    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);
    const handleSave = () => {
        console.log('Changes saved!');
        handleClose();
    };

  return (
    <div className='main'>
      <div className='btnAddSection'>
        <button onClick={handleShow} className='btnAdd'>Add offer</button>
      </div>
      <FullScreenModal
        show={modalShow}
        handleClose={handleClose}
        handleSave={handleSave}
        title='Create new Offer'>
        <CreateOffers />
      </FullScreenModal>
      <div className='container'>
        {allDummyData.map(item => (
          <div key={item.id} className='box'>
            <div className='left'>
              <img className='image' src={item.photo} alt='' />
            </div>
            <div className='right'>
              <div>
                <h1 className='title'>{item.title}</h1>
                <p className='desc'>{item.desc}</p>
              </div>
              <div className='sectionPrice'>
                <div>
                  <p className='oldPrice'>{item.oldPrice}€</p>
                  <p className='price'>{item.price}€</p>
                </div>
                <div>
                  <a className='btnBookNow' href='/offers'>
                    Book now
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
