import mongoose from "mongoose";

const warningSchema = new mongoose.Schema({
  mensagem: { type: String, required: true },
  data: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    // Adicione outros campos conforme necessário
    status: {
      type: String,
      enum: ["Ativo", "Suspenso", "Excluído"],
      default: "Ativo",
    },
    suspendedUntil: { type: Date, default: null },
    warnings: [warningSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
