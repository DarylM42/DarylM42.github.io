/**
 * Render the contact page.
 */
const contactPage = (req, res) => {
    res.render('contact', {
        title: 'Contact'
    });
};

module.exports = {
    contactPage
};
