import React, { useState, useEffect } from 'react';

const Home = () => {
  // Assuming you have a user object with purchased PDFs
  const user = {
    username: 'user123',
    email: 'user123@example.com',
    purchasedPDFs: ['pdf1', 'pdf2'],
  };

  const [availablePDFs, setAvailablePDFs] = useState([]);

  useEffect(() => {
    // Assuming you have a function to fetch available PDFs from the server
    const fetchAvailablePDFs = async () => {
      try {
        const response = await fetch('https://example.com/api/available-pdfs');
        if (!response.ok) {
          throw new Error('Failed to fetch available PDFs');
        }
        const data = await response.json();
        setAvailablePDFs(data);
      } catch (error) {
        console.error('Error fetching available PDFs:', error.message);
      }
    };

    // Call the function to fetch available PDFs
    fetchAvailablePDFs();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  const handlePurchase = async (pdfName) => {
    try {
      // Assuming you have a function to initiate the purchase on the server
      const response = await fetch('https://example.com/api/purchase-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          pdfName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to purchase PDF');
      }

      // Update the user's purchased PDFs after a successful purchase
      user.purchasedPDFs.push(pdfName);

      // Update the state to reflect the new purchased PDF
      setAvailablePDFs((prevPDFs) => prevPDFs.filter((pdf) => pdf !== pdfName));
    } catch (error) {
      console.error('Error purchasing PDF:', error.message);
    }
  };

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <h2>Your Purchased PDFs:</h2>
      <ul>
        {user.purchasedPDFs.map((pdf, index) => (
          <li key={index}>{pdf}</li>
        ))}
      </ul>
      <h2>Available PDFs for Purchase:</h2>
      <ul>
        {availablePDFs.map((pdf, index) => (
          <li key={index}>
            {pdf}
            {' '}
            <button onClick={() => handlePurchase(pdf)}>Purchase</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
