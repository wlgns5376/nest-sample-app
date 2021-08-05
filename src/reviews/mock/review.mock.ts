// 테스트하기위한 Mongoose Model의 Mocking model
export class ReviewMockModel {
  data: any
  constructor(dto: any) {
    this.data = dto;
  }
  static find() {
    return {
      exec: async () => {
        return [];
      }
    }
  }
  async save() {
    return this.data;
  }

  static findById(id: any) {
    return {
      exec: async () => {
        return {
          _id: id
        };
      }
    }
  }

  static findByIdAndUpdate(id: string, dto: any) {
    return {
      exec: async () => {
        dto.id = id;
        return {
          ...dto
        }
      }
    }
  }

  static findByIdAndRemove(id: string) {
    return {
      exec: async () => {
        return {}
      }
    }
  }
}
   