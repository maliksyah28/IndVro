import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";
import instance from "../../servee";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Input, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { MdInsertPhoto } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";

const FeedContent = ({ allPost, allPostedLength, user }) => {
  const router = useRouter();
  // console.log(user.username);
  //buat GET post
  const [content, setContent] = useState(allPost); // [{id : 1}, {id: 2}, {id: 3}]
  // console.log(content);
  const [ofset, setOfSet] = useState(1);
  const [caption, setCaption] = useState();

  async function fetchMorePost() {
    try {
      const session = await getSession();
      const { token } = session.user;
      const getLimitedShow = { limit: 10 };
      const getOfSet = { ofset: (ofset - 1) * 10 };

      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      // console.log({ config });

      const responsGetAllPost = await instance.get(
        "/post/GetContent/", // endpoint nya di ubah, jangan pakai path variable :idpost, karena tidak digunakan
        config
      );
      //   console.log(responsGetAllPost);

      setContent(responsGetAllPost.data.data.result);
      setOfSet(ofset + 1);
    } catch (error) {
      console.log({ error });
    }
  }
  // buat ngepost
  const postCaption = () => {
    const [ContentImage, setContentImage] = useState(); // ini buat gambar post
    const [captionPost, setCaptionPost] = useState();

    async function Postcontent() {
      try {
        const session = await getSession();
        const { token } = session.user;

        const body = new FormData();
        body.append("content", ContentImage);
        body.append("caption", captionPost);
        const getLimitedShow = 10;
        const getOfSet = (ofset - 1) * 10;

        const config = {
          params: { getLimitedShow, getOfSet },
          headers: { Authorization: `Bearer ${token}` },
        };
        const responsNewContent = await instance.post(
          "/post/postContent",
          body,
          config
        );
        console.log(responsNewContent);
        alert(responsNewContent.data.message);

        const responsGetAllPost = await instance.get(
          "/post/GetContent/",
          config
        );
        // console.log({ responsGetAllPost });
        setContent(responsGetAllPost.data.data.result);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
    return (
      <div>
        <Flex dir="row">
          <form>
            <input
              type={"text"}
              marginLeft={"5px"}
              width={"100%"}
              placeholder="Describe your feel?"
              variant={"ghost"}
              value={captionPost}
              onChange={(event) => setCaptionPost(event.target.value)}
            />
            {ContentImage && (
              <Flex flexDirection="column">
                <MdOutlineClose onClick={() => setContentImage()} />
                <Image
                  width={"20px"}
                  height={"20px"}
                  boxSize="100px"
                  objectFit="cover"
                  src={URL.createObjectURL(ContentImage)}
                />
              </Flex>
            )}
            <Flex marginLeft={"5px"} alignItems={"center"}>
              <label
                htmlFor="imagePost"
                style={{
                  alignItems: "center",
                  cursor: "pointer",
                  marginLeft: "60px",
                  marginTop: "5px",
                }}
              >
                <MdInsertPhoto />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="imagePost"
                  onChange={(event) => setContentImage(event.target.files[0])}
                />
              </label>
              <Button px={"5"} py={"2"} rounded={"full"} onClick={Postcontent}>
                POST
              </Button>
            </Flex>
          </form>
        </Flex>
      </div>
    );
  };

  // like
  // cara ambil param tuh begini contohnya
  async function likeContent(idpost) {
    // console.log({ props });
    try {
      const session = await getSession();
      // console.log({ session });

      const { token } = session.user;
      // console.log(token);
      const getLimitedShow = 10;
      const getOfSet = (ofset - 1) * 10;
      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      // console.log(config.headers);
      await instance.post(`/likes/likedContent/${idpost}`, {}, config);
      alert("content Liked");
      //buat get kembali
      const responsGetAllPost = await instance.get(
        "/post/GetContent/:idpost",
        config
      );
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  }

  // delete post
  async function delContent(idpost) {
    try {
      const session = await getSession();
      const { token } = session.user;
      const getLimitedShow = 10;
      const getOfSet = (ofset - 1) * 10;
      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      await instance.delete(`/post/postdelete/${idpost}`, {}, config);
      alert("content Has Been Delete");

      const responsGetAllPost = await instance.get("/post/GetContent/", config);
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  }

  // edit content caption
  async function editCaption(idpost) {
    try {
      const session = await getSession();
      const { token } = session.user;
      const getLimitedShow = 10;
      const getOfSet = (ofset - 1) * 10;
      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { caption };
      await instance.patch(`/post/editCaptionContent/${idpost}`, body, config);
      alert("caption updated");
      const responsGetAllPost = await instance.get(
        "/post/GetContent/:idpost",
        config
      );
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      onsole.log({ error });
      alert(error.response.data.message);
    }
  }

  // tampilan
  function renderContentUser() {
    if (!content.length) {
      return (
        <div className="flex items-center justify-center w-[100%] h-[100%]">
          <p>
            {" "}
            You havent post anything yet,{" "}
            <a href="/postan" className="text-blue-500 hover:underline">
              Post your first image!
            </a>
          </p>
        </div>
      );
    }
    const contentMap = content.map((post) => {
      if (user.username == post.username)
        return (
          <div className="w-[19vw] h-[25vw] flex flex-col items-start rounded-[1vh] border-gray-500 border mb-[1vh] relative overflow-hidden">
            <a href={`/detailPost/${post.idpost}`} className="z-[2]">
              <img
                className="w-[10vh] h-[10vw] rounded-[1vh] z-[2]"
                src={`http://localhost:2305${post.postan}`}
              />
            </a>
            <div className="flex flex-col items-between justify-between w-[100%] h-[2rem] z-[2]">
              <p className="text-[0.9rem] text-gray-400">
                {post.Timer.slice(0, 10)}
              </p>
              <div className="flex items-center">
                <p>Likes: {post.likes}</p>
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    likeContent(post.idpost);
                  }}
                >
                  {" "}
                  LIKE{" "}
                </Button>

                <Button
                  variant={"ghost"}
                  onClick={() => {
                    delContent(post.idpost);
                  }}
                >
                  {" "}
                  DELETE{" "}
                </Button>
                <p> ID : {post.idpost}</p>
              </div>
              <p className="text-[1.2rem] font-[600]"> {post.caption}</p>{" "}
              <Input
                type="text"
                value={caption}
                placeholder="GANTI PAKE MODAL!!!"
                variant="filled"
                mb={3}
                onChange={(event) => setCaption(event.target.value)}
              />
              <Button
                variant={"ghost"}
                onClick={() => {
                  editCaption(post.idpost);
                }}
              >
                {" "}
                Save{" "}
              </Button>
            </div>
            <div className="absolute w-[100%] h-[100%] bg-white blur-[60px] opacity-[.2]" />
          </div>
        );
    });
    return (
      <div className="flex flex-wrap items-start justify-evenly">
        {contentMap}
      </div>
    );
  }
  return (
    // <div>HEHE</div>
    <div className={styles.container}>
      <div className="w-[100%] h-[100%]">
        {postCaption()}
        <InfiniteScroll
          dataLength={allPostedLength}
          next={() => {
            setTimeout(() => {
              fetchMorePost();
            }, 2000);
          }}
          //hasMore={content.length != allPostedLength}
          loader={
            <h4 className="w-[100%] flex items-center justify-center ">
              Loading
            </h4>
          }
          // className="overflow-auto scrollbar"
          endMessage={
            <div style={{ textAlign: "center" }}>
              <p className="font-[montserrat] font-[700]">
                Yay! You have seen it all
              </p>
            </div>
          }
        >
          {renderContentUser()}
        </InfiniteScroll>
      </div>

      <footer className={styles.footer}>
        Powered by{" "}
        <span className={styles.logo}>
          <Image src="/enigma.png" alt="Vercel Logo" width={72} height={16} />
        </span>
      </footer>
    </div>
  );
};

// export async function getServerSideProps(context) {
//   try {
//     const session = await getSession({ req: context.req });
//     // console.log({ session });
//     // console.log(session);
//     if (!session) return { redirect: { destination: "/login" } };
//     console.log("tees");

//     const getLimitedShow = 10;
//     const getOfSet = 0;
//     // console.log({ getLimitedShow, getOfSet });
//     const { token } = session.user;
//     // console.log({ token });
//     // const { idpost } = context.params;
//     const config = {
//       params: { getLimitedShow, getOfSet },
//       headers: { Authorization: `Bearer ${token}` },
//     };
//     // console.log(config);
//     // user
//     const responsGetUser = await instance("/user/profile", config);

//     // buat ngambil data all post di API
//     const responsGetAllPost = await instance.get("/post/GetContent/", config);
//     // console.log({ allPost });
//     return {
//       props: {
//         user: responsGetUser.data.data.result,
//         session,
//         allPost: responsGetAllPost.data.data.result,
//         allPostedLength: responsGetAllPost.data.data.dataLength,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     const errorCaution = error.message;
//     return { props: { errorCaution } };
//   }
// }

export default FeedContent;
