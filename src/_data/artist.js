const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");


module.exports = async function() {
  const artistPageQuery = gql`
    query artistPostsQuery {
      posts(first: 100) {
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
    const panNumbers = [1,2,3,4,5,6,7,8,9,5,3,2,6,1,7,4,9,8];
    let archiveNumInt = 0;
    try {
      const data = await request(endpoint, artistPageQuery);
      data.posts.nodes.reverse().map((node) => {
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
          archiveNumInt = (panNumbers.length === archiveNumInt) ? 0 : archiveNumInt;
          const imagePath = `https://ik.imagekit.io/studiofwww/2021/04/archive-${panNumbers[archiveNumInt]}@2x.png`;
          paintDate['panImage'] = imagePath;
          exportPaintDates.push(paintDate);
          archiveNumInt++;
        })
      })
  
      return exportPaintDates;
  
    } catch (error) {
      console.log(error)
      throw new Error( error );
  }
}
