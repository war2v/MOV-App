import ListItem from "@/components/ListItem";
import Header from "@/components/Header";
import getSongs from "@/actions/getSongs";
import getVideos from "@/actions/getVideos";
import PageContent from "./components/PageContent";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const videos = await getVideos();

  return (
    <div
      className="
      bg-neutral-900
      rounded-lg
      h-full
      w-full
      overflow-hidden
      overflow-y-auto
    "
    >
      <Header>
        <div className="mb-2">
          <h1
            className="
            text-white
            text-3xl
            font-semibold
          "
          >
            Welcome
          </h1>
          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-3
            mt-4
          "
          >
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div
        className="
        mt-2 mb-7 px-6
      "
      >
        <div
          className="
          grid
          grid-cols-2
        "
        >
          <h1
            className="
            text-white
            text-2xl
            font-semibold
          "
          >
            New Releases
          </h1>
          <h1
            className="
            text-white
            text-2xl
            font-semibold
          "
          >
            Videos
          </h1>
        </div>
        <PageContent songs={songs} videos={videos} />
      </div>
    </div>
  );
}
