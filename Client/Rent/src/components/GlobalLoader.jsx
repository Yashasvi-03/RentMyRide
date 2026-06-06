// import {loading} from "../assets/Loading_plane.gif"
function GlobalLoader({loading}){
    if(!loading)
        return null;
    return(
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <img src="/Loading_plane.gif" alt="" className="w-50 h-50" />

        </div>
    )
}
export default GlobalLoader;