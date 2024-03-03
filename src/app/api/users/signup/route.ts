import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  console.log("testingggg");
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log("reqBody", reqBody);
    // check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User Already exists" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({ username, email, password: hashPassword });

    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "created user successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.log("errorrr", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
