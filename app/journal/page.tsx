import { UserButton } from "@clerk/nextjs"

const Journal = () => {
  return (
    <div>
      <div>I AM JOURNAL</div>
      <UserButton afterSignOutUrl="/"/>
    </div>
  )
}

export default Journal
