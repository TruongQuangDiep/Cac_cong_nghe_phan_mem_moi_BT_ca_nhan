export const getHomepage = async (req, res) => {
    // Render file index.ejs nằm trong thư mục views
    return res.render('index.ejs');
}