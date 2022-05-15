const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");

module.exports = async function () {
  const artistPageQuery = gql`
    query artistPostsQuery(
      $first: Int,
      $after: String,
    ) {
      posts(first: $first, after: $after) {
        edges {
          node {
            title
            content
            paintingDates {
              paintDates {
                showThisDate
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
                  imageCredit {
                    name
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  const endpoint = process.env.GRAPHQL_URL;
  const imageKitEndpoint = process.env.IK_ENDPOINT;
  const spacesUrl = process.env.DO_ENDPOINT;

  var imagekit = new ImageKit({
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint: imageKitEndpoint
  });

  let exportPaintDates = [];
  const panNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 5, 3, 2, 6, 1, 7, 4, 9, 8];
  let archiveNumInt = 0;
  try {
    let fetchMore = true;
    let variables = {
      first: 100,
      after: null
    }
    
    while( fetchMore ) {
      const data = await request(endpoint, artistPageQuery, variables);
      data.posts.edges.map((edge) => {
        const node = edge.node
        const title = node.title;
        const content = node.content;

        node.paintingDates.paintDates.forEach((paintDate) => {
          if(paintDate.showThisDate) {
            paintDate['title'] = title;
            paintDate['content'] = content;
            paintDate.images.map((imageObj) => {
              ioObject = {
                path: imageObj.image?.sourceUrl?.substring(spacesUrl.length),
                endpoint: imageKitEndpoint,
              };
              if (imageObj?.imageType?.name == 'Portait') {
                ioObject['transformation'] = [{
                  'height': '485',
                  'width': '800',
                  'focus': 'auto',
                }];
              }
              imageObj['imageKitUrl'] = imagekit.url(ioObject)
              
              if (imageObj?.imageType?.name != 'Portait') {
                ioObject['transformation'] = [{
                  height: '300',
                  width: '300',
                  crop: 'at_max'
                }];
                imageObj['imageKitThumbUrl'] = imagekit.url(ioObject)
              }
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
          }
        })
      })
      fetchMore = data.posts.pageInfo.hasNextPage
      variables = { ...variables, after: data.posts.pageInfo.endCursor || null }
    }

    exportPaintDates.sort(function(a, b) {
      let titleA = a.title.toUpperCase();
      let titleB = b.title.toUpperCase();

      if( titleA < titleB ) {
        return -1;
      }

      if( titleA > titleB ) {
        return 1;
      }

      return 0;
    })

    return exportPaintDates;

  } catch (error) {
    console.error(error)
    throw new Error(error);
  }
}
