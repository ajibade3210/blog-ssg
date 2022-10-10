import React from "react";
import matter from "gray-matter";
import Head from "next/head";
import { marked } from "marked";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

export const getStaticPaths = async () => {
  const resulting = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/blogs`);
  const result = await resulting.json();
  return {
    paths: result.data.map(result => ({
      params: { id: result.id.toString() },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/blogs/${params.id}`
  );

  const markdownWithMeta = await res.json();
  const parsedMarkdown = matter(markdownWithMeta.data.attributes.draft);
  const htmlString = marked(parsedMarkdown.content);

  const image = markdownWithMeta.data.attributes.imageUrl;

  return {
    props: {
      image,
      htmlString,
      data: parsedMarkdown.data,
    },
  };
};

export default function Post({ image, htmlString, data }) {
  console.log(image);
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <div className={styles.post}>
        <Image
          src={`${image}`}
          alt="blog-post"
          priority={true}
          className="rounded-full"
          width={600}
          height={400}
        />
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>
    </>
  );
};

