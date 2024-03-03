import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      "-password -isAdmin"
    );
    return NextResponse.json({ message: "User Found", data: user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
