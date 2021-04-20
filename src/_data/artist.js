const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");


module.exports = async function() {
  const artistPageQuery = gql`
    query artistPostsQuery {
      posts(first: 50, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          title
          content
          paintingDates {
            paintDates {
              location {
                name
              }
              date
              images {
                image {
                  sourceUrl
                }
                imageType {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;
    const endpoint = process.env.GRAPHQL_URL;
    const imageKitEndpoint = process.env.IK_ENDPOINT;
    const spacesUrl = process.env.DO_ENDPOINT;
  
    var imagekit = new ImageKit({
        publicKey : process.env.IK_PUBLIC_KEY,
        privateKey : process.env.IK_PRIVATE_KEY,
        urlEndpoint : imageKitEndpoint
    });
  
    let exportPaintDates = [];
    try {
      const data = await request(endpoint, artistPageQuery);
      data.posts.nodes.map((node) => {
        const title = node.title;
        const content = node.content;
        node.paintingDates.paintDates.forEach((paintDate) => {
          paintDate['title'] = title;
          paintDate['content'] = content;
          paintDate.images.map((imageObj) => {
            ioObject = {
              path: imageObj.image?.sourceUrl?.substring(spacesUrl.length),
              endpoint: imageKitEndpoint,
            };
            if(imageObj?.imageType?.name == 'Portait') {
              ioObject['transformation'] = [{
                'height': '485',
                'width': '800',
                'focus': 'auto',
              }];
            }
            imageObj['imageKitUrl'] = imagekit.url(ioObject)
          })
          paintDate['portrait'] = paintDate.images.filter(imageObj => imageObj?.imageType?.name == 'Portait')
          paintDate['artistImages'] = paintDate.images.filter(imageObj => imageObj?.imageType?.name == 'Artist Image')
          paintDate['leslieImages'] = paintDate.images.filter(imageObj => imageObj?.imageType?.name == 'Leslie Image')
          paintDate['locationImages'] = paintDate.images.filter(imageObj => imageObj?.imageType?.name == 'Location')
          exportPaintDates.push(paintDate);
        })
      })
  
      return exportPaintDates;
  
    } catch (error) {
      console.log(error)
      throw new Error( error );
  }
}
